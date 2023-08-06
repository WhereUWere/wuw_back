import { FileConfigProps } from './interface/config.interface';

export const file: FileConfigProps = {
    avatarFileMaxSize: parseInt(process.env.AVATAR_FILE_MAX_SIZE as string),
};
