<div id="help-modal" class="relative z-10 transition-all hidden" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <!-- Main modal -->
    <div tabindex="-1" aria-hidden="true"
        class="flex justify-center items-center fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] md:h-full">
        <div class="relative w-full lg:w-1/2 h-full md:h-auto">
            <!-- Modal content -->
            <div class="relative rounded-lg shadow bg-white">
                <!-- Modal header -->
                <div class="flex items-start justify-between p-4 rounded-t border-gray-100 border-b">
                    <h3 class="text-xl font-semibold text-gray-900">
                        Central de Ajuda
                    </h3>
                </div>
                <!-- Modal body -->
                <div class="px-6 py-3">
                    Instruções
                </div>
                <!-- Modal footer -->
                <div
                    class="flex justify-end p-6 space-x-2 border-t border-gray-200 rounded-b dborder-gray-100 border-b">
                    <button type="button" id="btn-close-confirmation-modal"
                        class="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-[#1976d2] hover:bg-sky-100 sm:ml-3 sm:w-auto">Cancelar</button>
                    <button type="submit" id="btn-save-confirmation-modal"
                        class="inline-flex w-full justify-center items-center rounded-md bg-[#1976d2] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1e88e5] sm:ml-3 sm:w-auto">
                        <svg id="spin-icon" aria-hidden="true" class="inline w-4 h-4 mr-2 hidden text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>