import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index, JoinColumn } from 'typeorm';
import { CompanyEntity } from './CompanyEntity';

@Entity({ name: 'transfers' })
export class TransferEntity {
	@PrimaryGeneratedColumn('uuid')
	public id: string;

	@ManyToOne(() => CompanyEntity, (company) => company.transfersSent, { nullable: false })
	@JoinColumn({ name: 'from_company', referencedColumnName: 'id' })
	public fromCompany: CompanyEntity;

	@ManyToOne(() => CompanyEntity, (company) => company.transfersReceived, { nullable: false })
	@JoinColumn({ name: 'to_company', referencedColumnName: 'id' })
	public toCompany: CompanyEntity;

	@Column('decimal', { precision: 10, scale: 2 })
	public amount: number;

	@CreateDateColumn({ name: 'created_at' })
	public createdAt: Date;

	@Column({ type: 'datetime', name: 'transferred_at' })
	@Index()
	public transferredAt: Date;
}
