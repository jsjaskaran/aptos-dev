import { Clock, Edit, Share, Trash } from 'lucide-react';
import { Message } from './ChatWindow';
import { useEffect, useState } from 'react';
import { formatTimeDifference } from '@/lib/utils';
import DeleteChat from './DeleteChat';

const Navbar = ({
  chatId,
  messages,
}: {
  messages: Message[];
  chatId: string;
}) => {
  const [title, setTitle] = useState<string>('');
  const [timeAgo, setTimeAgo] = useState<string>('');

  useEffect(() => {
    if (messages.length > 0) {
      const newTitle =
        messages[0].content.length > 20
          ? `${messages[0].content.substring(0, 20).trim()}...`
          : messages[0].content;
      setTitle(newTitle);
      const newTimeAgo = formatTimeDifference(
        new Date(),
        messages[0].createdAt,
      );
      setTimeAgo(newTimeAgo);
    }
  }, [messages]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (messages.length > 0) {
        const newTimeAgo = formatTimeDifference(
          new Date(),
          messages[0].createdAt,
        );
        setTimeAgo(newTimeAgo);
      }
    }, 1000);

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed z-40 top-0 left-0 right-0 px-4 lg:pl-[104px] lg:pr-6 lg:px-8 flex flex-row items-center justify-between w-full py-4 text-sm text-black dark:text-white/70 border-b bg-light-primary dark:bg-dark-primary border-light-100 dark:border-dark-200">
      <a
        href="/"
        className="active:scale-95 transition duration-100 cursor-pointer lg:hidden"
      >
        <Edit size={17} />
      </a>
      <div className="hidden lg:flex flex-row items-center justify-center space-x-2">
        <Clock size={17} />
        <p className="text-xs">{timeAgo} ago</p>
      </div>
      <p className="hidden lg:flex">
      <svg width={100} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 76 34" className="h-fsxl"><path fill="currentColor" fill-rule="evenodd" d="M54.967 11.719a.515.515 0 00.373-.16l.748-.777a.494.494 0 01.356-.153h.031c.141 0 .277.06.37.167l.63.71c.12.135.291.213.472.213h1.687a8.795 8.795 0 00-7.04-3.514 8.795 8.795 0 00-7.041 3.514h9.414zm.89 2.373H60.904c.242.69.4 1.418.463 2.173H54.82a.632.632 0 01-.473-.213l-.63-.71a.493.493 0 00-.37-.167h-.03a.493.493 0 00-.357.153l-.747.778a.516.516 0 01-.373.16h-8.02a8.74 8.74 0 01.462-2.173h8.495c.267 0 .52-.115.698-.314l.54-.61a.493.493 0 01.74 0l.63.71c.12.135.292.213.472.213zm-6.81 6.58a.516.516 0 01-.374.159h-4.012a8.72 8.72 0 01-.72-2.193h5.71c.267 0 .52-.114.697-.314l.54-.61a.493.493 0 01.74 0l.63.71c.12.136.292.213.473.213h8.515a8.734 8.734 0 01-.72 2.194h-8.872a.632.632 0 01-.473-.213l-.63-.71a.493.493 0 00-.37-.167h-.03a.493.493 0 00-.357.153l-.747.778zm.224 2.334h9.76a8.783 8.783 0 01-6.438 2.799 8.783 8.783 0 01-6.438-2.798h.036c.267 0 .52-.115.697-.314l.54-.61a.493.493 0 01.74 0l.63.71c.12.135.292.213.473.213zm-35.61 2.23l-1.792-4.35H3.863l-1.792 4.35H0L7.854 8.772l7.878 16.462h-2.071zm-9.122-6h6.632l-3.327-7.014-3.305 7.014zM18.593 8.773v16.462h1.932v-7.022h2.63c3.49 0 5.492-1.604 5.492-4.697 0-3.092-1.885-4.743-5.47-4.743h-4.584zm4.12 7.72h-2.188v-6h2.188c2.746 0 3.98.954 3.98 3.023 0 2.07-1.21 2.976-3.98 2.976zm12.95-5.953h-5.679V8.773h13.289v1.767h-5.679v14.695h-1.932V10.54zM65.75 21.108l-1.664 1.128v-.001c1.326 2.465 3.095 3.441 5.655 3.441 3.049 0 5.19-2.116 5.19-4.603 0-2.28-.932-3.698-4.725-5.418-2.909-1.326-3.584-2.047-3.584-3.302 0-1.348 1.047-2.348 2.84-2.348 1.466 0 2.327.628 3.025 1.72l.396.094 1.35-.93c-.885-1.582-2.444-2.558-4.725-2.558-3.095 0-4.887 1.79-4.887 4.069 0 2.092 1.164 3.557 4.585 4.975 2.979 1.233 3.724 2.233 3.724 3.721 0 1.581-1.327 2.883-3.212 2.883-1.699 0-2.816-.744-3.84-2.604l-.128-.267z" clip-rule="evenodd"></path></svg>
      </p>

      <div className="flex flex-row items-center space-x-4">
        
      </div>
    </div>
  );
};

export default Navbar;
