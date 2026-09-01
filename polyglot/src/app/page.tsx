import { redirect } from 'next/navigation';

export default function RootPage() {
  // Instantly redirects the user to /flows
  // (Because of your middleware, if they aren't logged in, 
  // it will intercept this and send them to /login anyway!)
  redirect('/flows');
}