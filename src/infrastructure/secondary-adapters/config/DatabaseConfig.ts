import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
	database: process.env['DATABASE_NAME'] ? `${process.env['DATABASE_NAME']}.sqlite` : 'database.sqlite',
	entities: [__dirname + '/../../domain/entities/*Entity.js'],
	synchronize: false,
	autoloadEntities: false,
}));
