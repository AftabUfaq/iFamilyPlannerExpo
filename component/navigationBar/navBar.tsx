import { Route } from 'react-router-dom';

export default function NavBar() {
  return (
    <div
      className={
        'bg-white w-full flex justify-center items-center space-x-9 h-28'
      }
    >
      <a
        className={'text-black  text-3xl'}
        href="/src/renderer/component/Calendar/calender"
      >
        Kalender
      </a>{' '}
      <Route path="/Calender">Opgaver</Route>
    </div>
  );
}
