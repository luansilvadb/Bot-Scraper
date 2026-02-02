import { ScrapedProductData } from '../../workers/dto/ws-events.dto';

export class TaskResultDto extends ScrapedProductData {
  taskId: string;
  scrapedAt: Date;
}
