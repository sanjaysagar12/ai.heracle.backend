---
description: Rules for creating new API endpoints in this NestJS backend
---

# Endpoint Creation Rules

When creating a new endpoint in this project, you MUST always write **both** a request DTO and a response DTO before writing the service or controller code.

## 1. Request DTO

Create in `src/<feature>/dto/<action>-request.dto.ts` (or `<name>.dto.ts`):

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateXxxRequestDto {
    // Required field
    @ApiProperty({ example: 'value', description: 'What this is' })
    requiredField: string;

    // Optional field
    @ApiPropertyOptional({ example: 42 })
    optionalField?: number;
}
```

**Rules:**
- All fields that are optional must use `?` and `@ApiPropertyOptional`
- For PATCH/upsert endpoints, make **all** fields optional so callers can send just what changed
- Always add `example:` so Swagger is useful

## 2. Response DTO

Create in `src/<feature>/dto/<action>-response.dto.ts`:

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class XxxResponseDto {
    @ApiProperty({ example: 'uuid-...' })
    id: string;

    @ApiProperty({ example: 'value' })
    requiredField: string;

    @ApiPropertyOptional()
    optionalField: number | null;

    @ApiProperty()
    createdAt: Date;

    @ApiPropertyOptional()
    updatedAt: Date | null;
}
```

**Rules:**
- Nullable DB fields → `field: Type | null` + `@ApiPropertyOptional`
- Never return the raw Prisma object — use `select: {}` in the query to pick fields explicitly
- The response DTO shape must match exactly what the `select` returns

## 3. Service method

```typescript
async createXxx(userId: string, dto: CreateXxxRequestDto): Promise<XxxResponseDto> {
    return this.prisma.xxx.upsert({
        where: { userId },
        create: { userId, ...fields },
        update: {
            // spread only defined fields:
            ...(dto.field !== undefined && { field: dto.field }),
            updatedAt: new Date(),
        },
        select: { id: true, field: true, createdAt: true, updatedAt: true },
    });
}
```

## 4. Controller endpoint

```typescript
@Post('xxx')
@ApiOperation({ summary: 'Short summary', description: 'Longer description.' })
@ApiBody({ type: CreateXxxRequestDto })
@ApiOkResponse({ type: XxxResponseDto })
async createXxx(@Req() req: any, @Body() body: CreateXxxRequestDto): Promise<XxxResponseDto> {
    return this.xxxService.createXxx(req.user.id, body);
}
```

**Key facts:**
- `req.user` = full User DB object set by `JwtStrategy` — use `req.user.id` for the UUID
- Static path segments (`profile`, `today`) must come **before** param segments (`:id`, `:username`)
- Add `@Public()` only if no auth is needed

## 5. Swagger decorators checklist

```
Class level:
  @ApiTags('FeatureName')
  @ApiBearerAuth('JWT')        ← if JWT protected

Method level:
  @ApiOperation({ summary, description })
  @ApiBody({ type: RequestDto })   ← POST/PUT/PATCH only
  @ApiOkResponse({ type: ResponseDto })
  @ApiNotFoundResponse()           ← if you throw NotFoundException
```

## 6. Schema changes

If you add/modify a Prisma model, run:

```bash
npm run prisma:migrate -- --name add_xxx_fields
```

Files to edit are in `prisma_db_schema/` (NOT `prisma/schema.prisma` directly — that is auto-generated).
