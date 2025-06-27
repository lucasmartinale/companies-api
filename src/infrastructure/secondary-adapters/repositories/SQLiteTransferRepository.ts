import { InjectRepository } from '@nestjs/typeorm';
import { ITransferRepository } from 'src/application/interfaces/ITransferRepository';
import { TransferEntity } from 'src/domain/entities/TransferEntity';
import { Repository } from 'typeorm';

export class SQLiteTransferRepository implements ITransferRepository {
	constructor(
		@InjectRepository(TransferEntity)
		private readonly ormRepository: Repository<TransferEntity>,
	) {}

	public async deleteAll(): Promise<void> {
		await this.ormRepository.clear();
	}

	public async saveMany(transfers: TransferEntity[]): Promise<void> {
		await this.ormRepository.save(transfers);
	}
}
