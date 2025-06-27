import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { databaseConfig } from '../config/DatabaseConfig';

@Injectable()
export class SQLiteOptionsFactory implements TypeOrmOptionsFactory {
	constructor(
		@Inject(databaseConfig.KEY)
		private readonly databaseConfiguration: ConfigType<typeof databaseConfig>,
	) { }

	public createTypeOrmOptions(): TypeOrmModuleOptions {
		return {
			type: 'sqlite',
			...this.databaseConfiguration,
			autoLoadEntities: true,
		};
	}
}
