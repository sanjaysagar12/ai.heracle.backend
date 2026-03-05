import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthService {
	private prisma = new PrismaClient();

	constructor(private readonly jwtService: JwtService) { }

	// Find existing user by email or create a new one, then return a jwt + user
	async validateOAuthLogin(profile: any) {
		if (!profile || !profile.emails || !profile.emails.length) {
			throw new InternalServerErrorException('No email found from Google OAuth');
		}

		const email: string = profile.emails[0].value;
		let user = await this.prisma.user.findUnique({ where: { email } });

		if (!user) {
			// create username from local-part of email, ensure uniqueness by appending random suffix if needed
			let baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 30) || 'user';
			let username = baseUsername;
			let suffix = 0;
			while (await this.prisma.user.findUnique({ where: { username } })) {
				suffix += 1;
				username = `${baseUsername}${suffix}`;
			}

			user = await this.prisma.user.create({
				data: {
					username,
					name: profile.displayName || username,
					email,
					avatarUrl: profile.photos?.[0]?.value || null,
					bio: null,
				},
			});
		}

		const payload = { sub: user.id, email: user.email, role: user.role };
		const token = this.jwtService.sign(payload);

		return { user, token };
	}

	// Verify a Firebase ID token (issued by Firebase Auth on the mobile client)
	// and return { user, token } where token is our own JWT
	async validateIdToken(idToken: string) {
		if (!idToken) {
			throw new UnauthorizedException('Missing idToken');
		}

		let decodedToken: admin.auth.DecodedIdToken;
		try {
			decodedToken = await admin.auth().verifyIdToken(idToken);
		} catch (err) {
			throw new UnauthorizedException('Invalid Firebase ID token');
		}

		if (!decodedToken.email) {
			throw new UnauthorizedException('Firebase token does not contain an email');
		}

		// Build a profile-like object that validateOAuthLogin expects
		const profileLike = {
			emails: [{ value: decodedToken.email }],
			displayName: decodedToken.name || decodedToken.email.split('@')[0],
			photos: decodedToken.picture ? [{ value: decodedToken.picture }] : [],
		};

		// Reuse existing logic to find-or-create user and issue our JWT
		return this.validateOAuthLogin(profileLike);
	}

	// Developer-only method to generate a token for an email without Firebase verification
	async generateDevToken(email: string) {
		const profileLike = {
			emails: [{ value: email }],
			displayName: email.split('@')[0],
			photos: [],
		};

		return this.validateOAuthLogin(profileLike);
	}
}
