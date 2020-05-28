import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from './logger';

describe('Logger', () => {
  let provider: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Logger],
    }).compile();

    provider = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
