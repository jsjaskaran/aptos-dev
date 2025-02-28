import { Settings } from 'lucide-react';
import EmptyChatMessageInput from './EmptyChatMessageInput';
import { useState } from 'react';
import { File } from './ChatWindow';
import Link from 'next/link';

const EmptyChat = ({
  sendMessage,
  focusMode,
  setFocusMode,
  optimizationMode,
  setOptimizationMode,
  fileIds,
  setFileIds,
  files,
  setFiles,
}: {
  sendMessage: (message: string) => void;
  focusMode: string;
  setFocusMode: (mode: string) => void;
  optimizationMode: string;
  setOptimizationMode: (mode: string) => void;
  fileIds: string[];
  setFileIds: (fileIds: string[]) => void;
  files: File[];
  setFiles: (files: File[]) => void;
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="relative">
      <div className="absolute w-full flex flex-row items-center justify-end mr-5 mt-5">
        <Link href="/settings">
          <Settings className="cursor-pointer lg:hidden" />
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen max-w-screen-sm mx-auto p-2 space-y-8">
        
        <div className="flex items-center gap-3 -mt-8">
        <svg width={100} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 76 34" className="h-fsxl"><path fill="currentColor" fill-rule="evenodd" d="M54.967 11.719a.515.515 0 00.373-.16l.748-.777a.494.494 0 01.356-.153h.031c.141 0 .277.06.37.167l.63.71c.12.135.291.213.472.213h1.687a8.795 8.795 0 00-7.04-3.514 8.795 8.795 0 00-7.041 3.514h9.414zm.89 2.373H60.904c.242.69.4 1.418.463 2.173H54.82a.632.632 0 01-.473-.213l-.63-.71a.493.493 0 00-.37-.167h-.03a.493.493 0 00-.357.153l-.747.778a.516.516 0 01-.373.16h-8.02a8.74 8.74 0 01.462-2.173h8.495c.267 0 .52-.115.698-.314l.54-.61a.493.493 0 01.74 0l.63.71c.12.135.292.213.472.213zm-6.81 6.58a.516.516 0 01-.374.159h-4.012a8.72 8.72 0 01-.72-2.193h5.71c.267 0 .52-.114.697-.314l.54-.61a.493.493 0 01.74 0l.63.71c.12.136.292.213.473.213h8.515a8.734 8.734 0 01-.72 2.194h-8.872a.632.632 0 01-.473-.213l-.63-.71a.493.493 0 00-.37-.167h-.03a.493.493 0 00-.357.153l-.747.778zm.224 2.334h9.76a8.783 8.783 0 01-6.438 2.799 8.783 8.783 0 01-6.438-2.798h.036c.267 0 .52-.115.697-.314l.54-.61a.493.493 0 01.74 0l.63.71c.12.135.292.213.473.213zm-35.61 2.23l-1.792-4.35H3.863l-1.792 4.35H0L7.854 8.772l7.878 16.462h-2.071zm-9.122-6h6.632l-3.327-7.014-3.305 7.014zM18.593 8.773v16.462h1.932v-7.022h2.63c3.49 0 5.492-1.604 5.492-4.697 0-3.092-1.885-4.743-5.47-4.743h-4.584zm4.12 7.72h-2.188v-6h2.188c2.746 0 3.98.954 3.98 3.023 0 2.07-1.21 2.976-3.98 2.976zm12.95-5.953h-5.679V8.773h13.289v1.767h-5.679v14.695h-1.932V10.54zM65.75 21.108l-1.664 1.128v-.001c1.326 2.465 3.095 3.441 5.655 3.441 3.049 0 5.19-2.116 5.19-4.603 0-2.28-.932-3.698-4.725-5.418-2.909-1.326-3.584-2.047-3.584-3.302 0-1.348 1.047-2.348 2.84-2.348 1.466 0 2.327.628 3.025 1.72l.396.094 1.35-.93c-.885-1.582-2.444-2.558-4.725-2.558-3.095 0-4.887 1.79-4.887 4.069 0 2.092 1.164 3.557 4.585 4.975 2.979 1.233 3.724 2.233 3.724 3.721 0 1.581-1.327 2.883-3.212 2.883-1.699 0-2.816-.744-3.84-2.604l-.128-.267z" clip-rule="evenodd"></path></svg>
          <h2 className="text-black/70 dark:text-white/70 text-3xl font-medium">
            Bot
          </h2>
        </div>
        <EmptyChatMessageInput
          sendMessage={sendMessage}
          focusMode={focusMode}
          setFocusMode={setFocusMode}
          optimizationMode={optimizationMode}
          setOptimizationMode={setOptimizationMode}
          fileIds={fileIds}
          setFileIds={setFileIds}
          files={files}
          setFiles={setFiles}
        />
      </div>
    </div>
  );
};

export default EmptyChat;
