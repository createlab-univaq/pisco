import NextAuth from 'next-auth';
import { authOptions } from '../../../utils/authOptions';

export default NextAuth(authOptions);
