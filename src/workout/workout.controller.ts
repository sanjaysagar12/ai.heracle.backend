import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WorkoutService } from './workout.service';
import { TodayWorkoutResponseDto, WorkoutSessionDto } from './dto/today-workout.dto';
import { SaveWorkoutPreferencesDto, WorkoutPreferencesResponseDto } from './dto/workout-preferences.dto';
import { ExerciseListResponseDto } from './dto/exercise-list.dto';

@ApiTags('Workout')
@ApiBearerAuth('JWT')
@Controller('workout')
export class WorkoutController {
    constructor(private readonly workoutService: WorkoutService) { }

    @Get('today')
    @ApiOperation({
        summary: "Get today's suggested workout",
        description: 'Returns the recommended workout plan for today. Returns null if workout preferences are not set.',
    })
    @ApiOkResponse({ type: TodayWorkoutResponseDto })
    async getTodayWorkout(@Req() req: any): Promise<TodayWorkoutResponseDto | null> {
        return this.workoutService.getTodayWorkout(req.user.id);
    }

    @Get('sessions')
    @ApiOperation({
        summary: 'Get workout sessions',
        description: 'Returns all available workout sessions with their exercises',
    })
    @ApiOkResponse({ type: [WorkoutSessionDto] })
    getSessions(): WorkoutSessionDto[] {
        return this.workoutService.getSessions();
    }

    @Get('exercises')
    @ApiOperation({
        summary: 'Get all exercises',
        description: 'Returns a list of all available exercises from the database',
    })
    @ApiOkResponse({ type: [ExerciseListResponseDto] })
    async getExercises(): Promise<ExerciseListResponseDto[]> {
        return this.workoutService.getExercises();
    }

    @Get('preferences')
    @ApiOperation({
        summary: 'Get workout preferences',
        description: 'Returns the stored workout preferences for the authenticated user',
    })
    @ApiOkResponse({ type: WorkoutPreferencesResponseDto })
    async getWorkoutPreferences(@Req() req: any) {
        return this.workoutService.getWorkoutPreferences(req.user.id);
    }

    @Post('preferences')
    @ApiOperation({
        summary: 'Save workout preferences',
        description: 'Creates or updates workout preferences. All fields are optional — send only what you want to change.',
    })
    @ApiBody({ type: SaveWorkoutPreferencesDto })
    @ApiOkResponse({ type: WorkoutPreferencesResponseDto })
    async saveWorkoutPreferences(@Req() req: any, @Body() body: SaveWorkoutPreferencesDto) {
        return this.workoutService.saveWorkoutPreferences(req.user.id, body);
    }
}


