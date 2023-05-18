<div id="flight-plan-configuration-modal" class="relative z-10 transition-all hidden">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <!-- Main modal -->
    <div class="flex justify-center items-center fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] md:h-full">
        <div class="relative w-full lg:w-1/2 h-full md:h-auto">
            <!-- Modal content -->
            <div class="relative rounded-lg shadow bg-white">
                <!-- Modal header -->
                <div class="flex items-start justify-between p-4 rounded-t border-gray-100 border-b">
                    <h3 class="text-xl font-semibold text-gray-900">
                        Confirmação dos dados
                    </h3>

                </div>
                <!-- Modal body -->
                <form class="w-full px-6 py-3" name="config">
                    <div class="py-4">
                        <select id="locations"
                            class="w-full mt-2 border text-gray-700 text-sm rounded-lg p-2.5 focus:outline-none focus:shadow-outline hover:border-gray-300 cursor-pointer"
                            onchange="console.log(this.value)">
                            <option selected disabled>Selecione uma plantação</option>
                            <option value="1">#01</option>
                            <option value="2">#02</option>
                            <option value="3">#03</option>
                        </select>
                    </div>
        
                    <div class="w-full mb-1">
                        <div class="px-2 py-2">
                            <input type="checkbox" name="wp-grid" id="wp-grid"
                                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded accent-blue-500 cursor-pointer">
                            <label for="wp-grid" id="label-grid" class="text-gray-900">WP Grid</label>
                        </div>
                        <div class="px-2 py-2">
                            <input type="checkbox" name="optimize" id="optimize"
                                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded accent-blue-500 cursor-pointer">
                            <input type="hidden" name="extra-distance" id="extra-distance" value="0">
                            <label for="optimize" id="label-optimize" class="text-gray-900">Otimizar</label>
                        </div>
                    </div>
        
                    <div class="w-full">
                        <div class="block px-2 py-4 text-sm text-left cursor-pointer">
                            <label for="max-flight-time" id="label-max-flight-time"
                                class="block mb-2 text-sm font-medium text-gray-900">Tempo:
                                15min</label>
                            <input type="range" min="5" max="20" value="15" name="max-flight-time"
                                id="max-flight-time"
                                class="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-blue-500" />
                        </div>
                        <div class="block px-2 py-4 text-sm text-left cursor-pointer">
                            <label for="altitude" id="label-altitude"
                                class="block mb-2 text-sm font-medium text-gray-900">Altitude: 10m</label>
                            <input id="altitude" name="altitude" type="range" min="10" max="50" value="10"
                                class="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-blue-500">
                        </div>
                        <div class="block px-2 py-4 text-sm text-left cursor-pointer">
                            <label for="speed" id="label-speed"
                                class="block mb-2 text-sm font-medium text-gray-900">Velocidade: 8m/s</label>
                            <input id="speed" name="speed" type="range" min="1" max="15" value="8"
                                class="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-blue-500">
                        </div>
                        <div class="block px-2 py-4 text-sm text-left cursor-pointer">
                            <label for="distance" id="label-distance"
                                class="block mb-2 text-sm font-medium text-gray-900">Distância:
                                50m</label>
                            <input id="distance" name="distance" type="range" min="1" max="100" value="50"
                                class="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-blue-500">
                        </div>
                    </div>
                </form>
                <!-- Modal footer -->
                <div
                    class="flex justify-end p-6 space-x-2 border-t border-gray-200 rounded-b dborder-gray-100 border-b">
                    <button type="submit" id="btn-save-configuration-modal"
                        class="inline-flex w-full justify-center items-center rounded-md bg-[#1976d2] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1e88e5] sm:ml-3 sm:w-auto">
                        <svg id="spin-icon" aria-hidden="true" class="inline w-4 h-4 mr-2 hidden text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>