import { CheckIcon, CogIcon, XIcon } from '@heroicons/react/solid';
import Tooltip from 'components/Tooltip';

export default function ActionName({ name }: { name: string }) {
  return (
    <div className="flex justify-center">
      {name === 'StreamModified' ? (
        <Tooltip content="Stream Modified">
          <div className="rounded bg-yellow-100 p-1 text-yellow-600">
            <CogIcon className="h-4 w-4" />
          </div>
        </Tooltip>
      ) : name === 'StreamCreated' ? (
        <Tooltip content="Stream Created">
          <div className="rounded bg-green-100 p-1 text-green-600">
            <CheckIcon className="h-4 w-4" />
          </div>
        </Tooltip>
      ) : name === 'StreamCancelled' ? (
        <Tooltip content="Stream Cancelled">
          <div className="rounded bg-red-100 p-1 text-red-600">
            <XIcon className="h-4 w-4" />
          </div>
        </Tooltip>
      ) : (
        ''
      )}
    </div>
  );
}
