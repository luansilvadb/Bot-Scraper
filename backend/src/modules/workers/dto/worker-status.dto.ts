import { WorkerStatus } from '../enums';

export class WorkerStatusDto {
  id: string;
  name: string;
  status: WorkerStatus;
  ispName: string | null;
  externalIp: string | null;
  lastHeartbeatAt: Date | null;
  tasksCompletedCount: number;
  tasksFailedCount: number;
  createdAt: Date;
  updatedAt: Date;
}
