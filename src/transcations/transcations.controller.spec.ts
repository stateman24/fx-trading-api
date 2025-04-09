import { Test, TestingModule } from '@nestjs/testing';
import { TranscationsController } from './transcations.controller';

describe('TranscationsController', () => {
  let controller: TranscationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TranscationsController],
    }).compile();

    controller = module.get<TranscationsController>(TranscationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
