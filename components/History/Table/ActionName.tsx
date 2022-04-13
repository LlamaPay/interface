import { CheckIcon, PencilIcon, XIcon } from '@heroicons/react/solid';
import Tooltip from 'components/Tooltip';

export default function ActionName({ name }: { name: string }) {
  return (
    <div className="flex items-center space-x-2">
      {name === 'StreamModified' ? (
        <>
          <Tooltip content="Modified Stream">
            <div className="rounded bg-yellow-100 p-1 text-yellow-600">
              <PencilIcon className="h-4 w-4" />
            </div>
          </Tooltip>
          <span>Stream Modified</span>
        </>
      ) : name === 'StreamCreated' ? (
        <>
          <Tooltip content="Incoming stream">
            <div className="rounded bg-green-100 p-1 text-green-600">
              <CheckIcon className="h-4 w-4" />
            </div>
          </Tooltip>
          <span>Stream Created</span>
        </>
      ) : name === 'StreamCancelled' ? (
        <>
          <Tooltip content="Cancelled stream">
            <div className="rounded bg-red-100 p-1 text-red-600">
              <XIcon className="h-4 w-4" />
            </div>
          </Tooltip>
          <span>Stream Cancelled</span>
        </>
      ) : (
        ''
      )}
    </div>
  );
}
