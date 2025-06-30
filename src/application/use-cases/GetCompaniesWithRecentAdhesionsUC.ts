import { Inject, Injectable } from '@nestjs/common';
import { COMPANY_REPO, ICompanyRepository } from '../interfaces/ICompanyRepository';
import { CompanyEntity } from 'src/domain/entities/CompanyEntity';

@Injectable()
export class GetCompaniesWithRecentAdhesionsUC {
	constructor(
		@Inject(COMPANY_REPO)
		private readonly companyRepository: ICompanyRepository,
	) {}

	public async execute(): Promise<CompanyEntity[]> {
		const oneMonthAgo = new Date();
		oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

		return this.companyRepository.findAllJoinedSince(oneMonthAgo);
	}
}
