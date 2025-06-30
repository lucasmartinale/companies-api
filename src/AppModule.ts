import { Module } from '@nestjs/common';
import { databaseConfig } from './infrastructure/secondary-adapters/config/DatabaseConfig';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SQLiteOptionsFactory } from './infrastructure/secondary-adapters/database/SQLiteOptionsFactory';
import { CompanyEntity } from './domain/entities/CompanyEntity';
import { TransferEntity } from './domain/entities/TransferEntity';
import { controllers } from './infrastructure/primary-adapters/http/controllers';
import { useCases } from './application/use-cases';
import { SQLiteCompanyRepository } from './infrastructure/secondary-adapters/repositories/SQLiteCompanyRepository';
import { COMPANY_REPO } from './application/interfaces/ICompanyRepository';
import { TRANSFER_REPO } from './application/interfaces/ITransferRepository';
import { SQLiteTransferRepository } from './infrastructure/secondary-adapters/repositories/SQLiteTransferRepository';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [databaseConfig],
		}),
		TypeOrmModule.forRootAsync({
			inject: [SQLiteOptionsFactory],
			useFactory: (config: SQLiteOptionsFactory) => config.createTypeOrmOptions(),
			extraProviders: [SQLiteOptionsFactory],
		}),
		TypeOrmModule.forFeature([CompanyEntity, TransferEntity]),
	],
	controllers: [...controllers],
	providers: [
		...useCases,
		{ provide: COMPANY_REPO, useClass: SQLiteCompanyRepository },
		{ provide: TRANSFER_REPO, useClass: SQLiteTransferRepository },
	],
})
export class AppModule {}
