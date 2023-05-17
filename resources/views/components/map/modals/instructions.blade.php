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
                    <iframe class="w-full aspect-video" src="https://www.youtube.com/embed/DWsPhE_rRSk"
						title="YouTube video player" frameborder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowfullscreen></iframe>
                </div>
                <!-- Modal footer -->
                <div
                    class="flex justify-end p-6 space-x-2 border-t border-gray-200 rounded-b dborder-gray-100 border-b">
                    <button type="submit" id="btn-close-help-modal"
                        class="inline-flex w-full justify-center items-center rounded-md bg-[#1976d2] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1e88e5] sm:ml-3 sm:w-auto">
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>