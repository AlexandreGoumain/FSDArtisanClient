interface FakePageProps {
    title: string;
}

export const FakePage = ({ title }: FakePageProps) => {
    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Section en cours de développement
                </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg
                            className="h-5 w-5 text-blue-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">
                            Page en développement
                        </h3>
                        <div className="mt-2 text-sm text-blue-700">
                            <p>
                                Cette page est actuellement en cours de
                                développement. Les fonctionnalités seront
                                ajoutées prochainement.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-sm font-medium text-gray-900">
                        Informations
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                        Section : {title}
                    </p>
                    <p className="text-sm text-gray-600">
                        Status : En développement
                    </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-sm font-medium text-gray-900">
                        Navigation
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                        Utilisez le menu de navigation pour accéder aux autres
                        sections.
                    </p>
                </div>
            </div>
        </div>
    );
};
