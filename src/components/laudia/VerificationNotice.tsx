import { LaudsOffice } from '@/types/laudia';

type VerificationNoticeProps = {
  office: LaudsOffice;
};

export default function VerificationNotice({ office }: VerificationNoticeProps) {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.33-.213 2.98-1.422 2.98H4.42c-1.209 0-2.172-1.65-1.422-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-medium text-yellow-800">
            Aviso de verificación
          </h3>
          <div className="mt-1 text-sm text-yellow-700">
            Algunos textos mostrados son placeholders pendientes de verificación oficial.
            En una versión futura se cargarán los textos aprobados de la Liturgia de las Horas.
          </div>
        </div>
      </div>
    </div>
  );
}