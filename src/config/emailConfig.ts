import { EmailConfigProps } from './interface/config.interface';

export const email: EmailConfigProps = {
    emailAddress: process.env.EMAIL_ADDRESS as string,
    emailPassword: process.env.EMAIL_PASSWORD as string,
};
