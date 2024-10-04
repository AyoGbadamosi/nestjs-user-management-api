import { User } from 'src/user/user.entity';

export const userRegisteredResponse = (user: User): any => {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
    };
};
