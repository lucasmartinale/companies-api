import { Controller, Post, ForbiddenException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SeedDatabaseUC } from 'src/application/use-cases/SeedDatabaseUC';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
	constructor(private readonly seedDatabaseUC: SeedDatabaseUC) {}

	@Post()
	@ApiOperation({ summary: 'Seed the database with demo data (DEV only)' })
	@ApiResponse({ status: 201, description: 'Database seeded successfully.' })
	@ApiResponse({
		status: 403,
		description: 'This endpoint is only available in development mode.',
	})
	public async seed(): Promise<{ message: string }> {
		if (process.env['NODE_ENV'] !== 'development') {
			throw new ForbiddenException('This endpoint is only available in development mode.');
		}

		await this.seedDatabaseUC.execute();
		return { message: 'Database seeded successfully.' };
	}
}
