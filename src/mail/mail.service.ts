import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { EmailVar, MailModuleOptions } from './mail.interfaces';
import fetch from 'node-fetch';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {}

  private async sendEmail(
    subject: string,
    template: string,
    emailVars: EmailVar[],
  ) {
    const params = new URLSearchParams();
    params.append(
      'from',
      `Nakun from Nuber Eats <mailgun@${this.options.domain}>`,
    );
    params.append('to', 'whskrdns@gmail.com');
    params.append('subject', subject);
    params.append('template', template);
    emailVars.forEach((eVar) => params.append(`v:${eVar.key}`, eVar.value));

    try {
      await fetch(
        `https://api.mailgun.net/v3/${this.options.domain}/messages`,
        {
          method: 'POST',
          body: params,
          headers: {
            Authorization: `Basic ${Buffer.from(
              `api:${this.options.apiKey}`,
            ).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
    } catch (e) {
      console.log(e);
    }
  }

  async sendVerificationEmail(email: string, code: string) {
    await this.sendEmail('Verify Your Email', 'confirm-account', [
      { key: 'code', value: code },
      { key: 'username', value: email },
    ]);
  }
}
