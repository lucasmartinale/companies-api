import { Inject, Injectable } from '@nestjs/common';
import { COMPANY_REPO, ICompanyRepository } from '../interfaces/ICompanyRepository';
import { ITransferRepository, TRANSFER_REPO } from '../interfaces/ITransferRepository';
import { CompanyEntity } from 'src/domain/entities/CompanyEntity';
import { TransferEntity } from 'src/domain/entities/TransferEntity';
import { CompanyTypeEnum } from 'src/domain/enums/CompanyTypeEnum';

@Injectable()
export class SeedDatabaseUC {
	constructor(
		@Inject(COMPANY_REPO)
		private readonly companyRepository: ICompanyRepository,
		@Inject(TRANSFER_REPO)
		private readonly transferRepository: ITransferRepository,
	) {}

	public async execute(): Promise<void> {
		await this.transferRepository.deleteAll();
		await this.companyRepository.deleteAll();

		const companyA = new CompanyEntity();
		companyA.cuit = '20301234568';
		companyA.name = 'Empresa Uno';
		companyA.type = CompanyTypeEnum.CORPORATE;
		companyA.joinedAt = new Date('2026-06-01');

		const companyB = new CompanyEntity();
		companyB.cuit = '27345678901';
		companyB.name = 'Empresa Dos';
		companyB.type = CompanyTypeEnum.PYME;
		companyB.joinedAt = new Date('2024-06-05');

		const companyC = new CompanyEntity();
		companyC.cuit = '30234567892';
		companyC.name = 'Empresa Tres';
		companyC.type = CompanyTypeEnum.PYME;
		companyC.joinedAt = new Date('2026-06-15');

		await this.companyRepository.saveMany([companyA, companyB, companyC]);

		const transfer1 = new TransferEntity();
		transfer1.fromCompany = companyA;
		transfer1.toCompany = companyB;
		transfer1.amount = 1200.5;
		transfer1.transferredAt = new Date(Date.now());

		const transfer2 = new TransferEntity();
		transfer2.fromCompany = companyB;
		transfer2.toCompany = companyC;
		transfer2.amount = 3000.0;
		transfer2.transferredAt = new Date(Date.now());

		const transfer3 = new TransferEntity();
		transfer3.fromCompany = companyC;
		transfer3.toCompany = companyA;
		transfer3.amount = 750.25;
		const twoMonthAgo = new Date();
		twoMonthAgo.setMonth(twoMonthAgo.getMonth() - 2);
		transfer3.transferredAt = new Date(twoMonthAgo);

		await this.transferRepository.saveMany([transfer1, transfer2, transfer3]);
	}
}
