import { CheckIcon, CogIcon, XIcon } from '@heroicons/react/solid';

export default function ActionName({ name }: { name: string }) {
  return (
    <div className="flex items-center space-x-2">
      {name === 'StreamModified' ? (
        <>
          <div className="rounded bg-yellow-100 p-1 text-yellow-600">
            <CogIcon className="h-4 w-4" />
          </div>

          <span>Stream Modified</span>
        </>
      ) : name === 'StreamCreated' ? (
        <>
          <div className="rounded bg-green-100 p-1 text-green-600">
            <CheckIcon className="h-4 w-4" />
          </div>

          <span>Stream Created</span>
        </>
      ) : name === 'StreamCancelled' ? (
        <>
          <div className="rounded bg-red-100 p-1 text-red-600">
            <XIcon className="h-4 w-4" />
          </div>

          <span>Stream Cancelled</span>
        </>
      ) : (
        ''
      )}
    </div>
  );
}
