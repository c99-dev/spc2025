function loading() {
  const itemsPerPage = 20;
  let startItemIndex = 0;
  let endItemIndex = startItemIndex + itemsPerPage;
  let isLoading = false;
  const scrollContainer = document.querySelector('.scroll-container');

  const loadingItems = async () => {
    const response = await fetch(
      `/items?start=${startItemIndex}&end=${endItemIndex}`
    );
    const data = await response.json();
    data.forEach((item) => {
      const div = document.createElement('div');
      div.textContent = item;
      div.classList.add('item');
      scrollContainer.appendChild(div);
    });
  };

  const loadingMoreItems = async () => {
    if (isLoading) return;
    isLoading = true;

    startItemIndex += itemsPerPage;
    endItemIndex = startItemIndex + itemsPerPage;
    await loadingItems();

    isLoading = false;
  };

  const handleScroll = async () => {
    const topOfScroll = window.scrollY <= 100;
    const endOfScroll =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
    if (!isLoading && (endOfScroll || topOfScroll)) {
      await loadingMoreItems();
    }
  };

  window.addEventListener('scroll', handleScroll);

  loadingItems();
}

document.addEventListener('DOMContentLoaded', loading);
