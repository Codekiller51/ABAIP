import React from 'react'
import { AlertTriangle, Clock } from 'lucide-react'

interface SessionTimeoutWarningProps {
  remainingTime: number
  onExtend: () => void
}

export const SessionTimeoutWarning: React.FC<SessionTimeoutWarningProps> = ({
  remainingTime,
  onExtend
}) => {
  const minutes = Math.floor(remainingTime / 60000)
  const seconds = Math.floor((remainingTime % 60000) / 1000)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-scale-in">
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6">
          <div className="flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
              <AlertTriangle className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>

        <div className="p-8">
          <h3 className="text-2xl font-bold text-neutral-900 mb-3 text-center">
            Session Timeout Warning
          </h3>

          <p className="text-neutral-600 text-center mb-6">
            Your session will expire due to inactivity. You will be automatically logged out in:
          </p>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 mb-6 border-2 border-amber-200">
            <div className="flex items-center justify-center space-x-3">
              <Clock className="h-8 w-8 text-amber-600" />
              <div className="text-4xl font-bold text-amber-700">
                {minutes}:{seconds.toString().padStart(2, '0')}
              </div>
            </div>
            <p className="text-center text-sm text-amber-700 mt-2">minutes remaining</p>
          </div>

          <button
            onClick={onExtend}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <span>Continue Session</span>
          </button>

          <p className="text-xs text-neutral-500 text-center mt-4">
            Any unsaved changes will be lost if your session expires
          </p>
        </div>
      </div>
    </div>
  )
}
