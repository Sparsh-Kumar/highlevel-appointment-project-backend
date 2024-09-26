import { injectable } from 'inversify';

@injectable()
export default class HealthCheckService {
  private message = 'Good !';

  async healthCheck(): Promise<string> {
    return Promise.resolve(this.message);
  }
}
