import { Body, Controller, Get, Param, Post, Req, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiNotFoundResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { UserService } from './user.service';
import { GetByUsernameResponseDto, ProfileResponseDto } from './dto';
import { BodyMetricsResponseDto, SaveBodyMetricsDto } from './dto/swagger/body-metrics.dto';
import { SaveTargetsDto, TargetsResponseDto } from './dto/swagger/targets.dto';
import { OnboardingStatusDto } from './dto/swagger/onboarding-status.dto';

@ApiTags('User')
@ApiBearerAuth('JWT')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('profile')
    @ApiOperation({ summary: 'Get current authenticated user profile' })
    @ApiOkResponse({ description: 'Profile returned', type: ProfileResponseDto })
    async getProfile(@Req() req: any) {
        const userId: string = req.user.id;
        const user = await this.userService.getProfile(userId);
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    @Get('body-metrics')
    @ApiOperation({ summary: 'Get body metrics & goals' })
    @ApiOkResponse({ type: BodyMetricsResponseDto })
    async getBodyMetrics(@Req() req: any) {
        return this.userService.getBodyMetrics(req.user.id);
    }

    @Get('onboarding-status')
    @ApiOperation({ summary: 'Check if user needs to fill body metrics or diet data' })
    @ApiOkResponse({ type: OnboardingStatusDto })
    async getOnboardingStatus(@Req() req: any) {
        return this.userService.getOnboardingStatus(req.user.id);
    }

    @Post('body-metrics')
    @ApiOperation({
        summary: 'Save body metrics & goals',
        description: 'Creates or updates age, gender, height, weight, body type and goal. All fields are optional.',
    })
    @ApiBody({ type: SaveBodyMetricsDto })
    @ApiOkResponse({ type: BodyMetricsResponseDto })
    async saveBodyMetrics(@Req() req: any, @Body() body: SaveBodyMetricsDto) {
        return this.userService.saveBodyMetrics(req.user.id, body);
    }

    @Post('targets')
    @ApiOperation({
        summary: 'Save target macros',
        description: 'Creates or updates target calories, protein, carbs, fat, and fiber. All fields are optional.',
    })
    @ApiBody({ type: SaveTargetsDto })
    @ApiOkResponse({ type: TargetsResponseDto })
    async saveTargets(@Req() req: any, @Body() body: SaveTargetsDto) {
        return this.userService.saveTargets(req.user.id, body);
    }

}

