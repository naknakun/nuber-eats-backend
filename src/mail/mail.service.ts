import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailModuleOptions } from './mail.interfaces';
import fetch from 'node-fetch';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    this.sendEmail('please', 'hahaha');
  }

  private async sendEmail(subject: string, content: string) {
    const params = new URLSearchParams();
    params.append(
      'from',
      'Excited User <mailgun@sandboxc2ba12643e7349baa0bd6e741ff8ad84.mailgun.org>',
    );
    params.append('to', 'whskrdns@gmail.com');
    params.append('subject', subject);
    params.append('text', content);

    const response = await fetch(
      'https://api.mailgun.net/v3/sandboxc2ba12643e7349baa0bd6e741ff8ad84.mailgun.org/messages',
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
    console.log(await response.json());
  }
}
