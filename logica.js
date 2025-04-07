document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const tableBody = document.getElementById('tableBody');
    const searchInput = document.getElementById('searchInput');
    const countryFilter = document.getElementById('countryFilter');
    const trackFilter = document.getElementById('trackFilter');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageInfo = document.getElementById('pageInfo');
    
    // Pagination variables
    let currentPage = 1;
    const recordsPerPage = 20;
    let filteredRecords = [];
    
    // Initialize the app
    function init() {
        populateCountryFilter();
        populateTrackFilter();
        filterRecords();
        
        // Event listeners
        searchInput.addEventListener('input', filterRecords);
        countryFilter.addEventListener('change', filterRecords);
        trackFilter.addEventListener('change', filterRecords);
        prevBtn.addEventListener('click', goToPrevPage);
        nextBtn.addEventListener('click', goToNextPage);
    }
    
    // Populate country filter dropdown
    function populateCountryFilter() {
        const countries = [...new Set(recordsData.map(record => record.country))].sort();
        
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            countryFilter.appendChild(option);
        });
    }
    
    // Populate track filter dropdown
    function populateTrackFilter() {
        const tracks = [...new Set(recordsData.map(record => record.track))].sort((a, b) => {
            // Sort tracks by number if they start with "Track"
            const numA = parseInt(a.replace('Track', ''));
            const numB = parseInt(b.replace('Track', ''));
            if (!isNaN(numA) && !isNaN(numB)) {
                return numA - numB;
            }
            return a.localeCompare(b);
        });
        
        tracks.forEach(track => {
            const option = document.createElement('option');
            option.value = track;
            option.textContent = track;
            trackFilter.appendChild(option);
        });
    }
    
    // Filter records based on search and filters
    function filterRecords() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCountry = countryFilter.value;
        const selectedTrack = trackFilter.value;
        
        filteredRecords = recordsData.filter(record => {
            const matchesSearch = 
                record.username.toLowerCase().includes(searchTerm) || 
                record.track.toLowerCase().includes(searchTerm);
            const matchesCountry = selectedCountry ? record.country === selectedCountry : true;
            const matchesTrack = selectedTrack ? record.track === selectedTrack : true;
            
            return matchesSearch && matchesCountry && matchesTrack;
        });
        
        currentPage = 1;
        renderTable();
        updatePagination();
    }
    
    // Render the table with current page records
    function renderTable() {
        tableBody.innerHTML = '';
        
        const startIndex = (currentPage - 1) * recordsPerPage;
        const endIndex = startIndex + recordsPerPage;
        const paginatedRecords = filteredRecords.slice(startIndex, endIndex);
        
        if (paginatedRecords.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="4" style="text-align: center;">No records found</td>`;
            tableBody.appendChild(row);
            return;
        }
        
        paginatedRecords.forEach(record => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${record.track}</td>
                <td>${record.username}</td>
                <td>${formatTime(record.time)}</td>
                <td>
                    <img src="https://flagcdn.com/16x12/${record.countryCode.toLowerCase()}.png" 
                         class="country-flag" 
                         alt="${record.country}" 
                         title="${record.country}">
                    ${record.country}
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    }
    
    // Format time in seconds to MM:SS.mmm
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = (seconds % 60).toFixed(3);
        return `${minutes}:${remainingSeconds.padStart(6, '0')}`;
    }
    
    // Pagination functions
    function goToPrevPage() {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
            updatePagination();
        }
    }
    
    function goToNextPage() {
        const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
            updatePagination();
        }
    }
    
    function updatePagination() {
        const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    }
    
    // Initialize the application
    init();
});
