import { TransferEntity } from 'src/domain/entities/TransferEntity';

export const TRANSFER_REPO = 'TransferRepositoryInterface';

export interface ITransferRepository {
	deleteAll(): Promise<void>;
	saveMany(transfers: TransferEntity[]): Promise<void>;
}
