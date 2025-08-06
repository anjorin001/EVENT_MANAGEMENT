import { IsEnum, IsOptional } from 'class-validator';
import { EventStatus } from 'src/common/enum/event.enum';

export class EventFilterDto {
  @IsOptional()
  @IsEnum(EventStatus, {
    message: 'eventStatus must be a valid EventStatus enum value',
  })
  eventStatus?: EventStatus;
}
