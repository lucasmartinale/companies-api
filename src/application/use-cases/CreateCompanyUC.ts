import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { COMPANY_REPO, ICompanyRepository } from '../interfaces/ICompanyRepository';
import { CompanyEntity } from 'src/domain/entities/CompanyEntity';

@Injectable()
export class CreateCompanyUC {
	constructor(
		@Inject(COMPANY_REPO)
		private readonly companyRepository: ICompanyRepository,
	) {}

	public async execute(companyEntity: CompanyEntity): Promise<CompanyEntity> {
		const existing = await this.companyRepository.findOneByCuit(companyEntity.cuit);
		if (existing) {
			throw new ConflictException('CUIT already exists');
		}

		return await this.companyRepository.createCompany(companyEntity);
	}
}
