import { InjectRepository } from '@nestjs/typeorm';
import { ICompanyRepository } from 'src/application/interfaces/ICompanyRepository';
import { CompanyEntity } from 'src/domain/entities/CompanyEntity';
import { Repository, MoreThanOrEqual } from 'typeorm';

export class SQLiteCompanyRepository implements ICompanyRepository {
	constructor(
		@InjectRepository(CompanyEntity)
		private readonly ormRepository: Repository<CompanyEntity>,
	) {}

	public async createCompany(companyEntity: CompanyEntity): Promise<CompanyEntity> {
		return await this.ormRepository.save(companyEntity);
	}

	public async findOneByCuit(cuit: string): Promise<CompanyEntity | null> {
		return await this.ormRepository.findOne({
			where: { cuit },
		});
	}

	public async findAllJoinedSince(date: Date): Promise<CompanyEntity[]> {
		return await this.ormRepository.find({
			where: {
				joinedAt: MoreThanOrEqual(date),
			},
			order: {
				joinedAt: 'DESC',
			},
		});
	}

	public async findAllWithTransfersSince(fromDate: Date): Promise<CompanyEntity[]> {
		return await this.ormRepository
			.createQueryBuilder('company')
			.innerJoin('company.transfersSent', 'transfer')
			.where('transfer.transferred_at >= :fromDate', { fromDate })
			.distinct(true)
			.getMany();
	}

	public async deleteAll(): Promise<void> {
		await this.ormRepository.clear();
	}

	public async saveMany(companies: CompanyEntity[]): Promise<void> {
		await this.ormRepository.save(companies);
	}
}
