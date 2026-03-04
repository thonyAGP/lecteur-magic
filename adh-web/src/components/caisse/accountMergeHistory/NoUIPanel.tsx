import { cn } from "@/lib/utils";

interface NoUIPanelProps {
  className?: string;
}

export const NoUIPanel = ({ className }: NoUIPanelProps) => {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-blue-100 p-2">
            <svg
              className="h-5 w-5 text-blue-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              Backend-Only Operation
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              This operation is called programmatically from the Fusion workflow (IDE 28)
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="rounded border border-gray-200 bg-white p-4">
            <h4 className="text-sm font-medium text-gray-700">Operation Details</h4>
            <dl className="mt-2 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="font-medium text-gray-500">Trigger:</dt>
                <dd className="text-gray-900">Fusion Workflow (IDE 28)</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-gray-500">Type:</dt>
                <dd className="text-gray-900">Automated History Entry Creation</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-gray-500">User Interaction:</dt>
                <dd className="text-gray-900">None (Backend-only)</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-gray-500">API Endpoint:</dt>
                <dd className="font-mono text-xs text-gray-900">POST /api/account-merge-history</dd>
              </div>
            </dl>
          </div>

          <div className="rounded border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-2">
              <svg
                className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-amber-800">
                This operation has no user interface. History entries are automatically
                created when account fusion operations complete successfully.
              </p>
            </div>
          </div>

          <div className="rounded border border-gray-200 bg-white p-4">
            <h4 className="text-sm font-medium text-gray-700">Automatic Logging</h4>
            <p className="mt-2 text-sm text-gray-600">
              When a fusion operation completes, the system automatically creates a history
              entry with operation details including account numbers, filiation numbers,
              and operation type.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};