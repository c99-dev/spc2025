const MAX_ITEM_DISPLAY = 100;

function loading() {
  const itemsPerPage = 20;
  let startItemIndex = 0;
  let endItemIndex = startItemIndex + itemsPerPage;
  let isLoading = false;
  const scrollContainer = document.querySelector('.scroll-container');

  const loadingItems = async (start, end) => {
    const response = await fetch(`/items?start=${start}&end=${end}`);
    const data = await response.json();
    data.forEach((item) => {
      const div = document.createElement('div');
      div.textContent = item;
      div.classList.add('item');
      scrollContainer.appendChild(div);
    });
  };

  const loadingMoreItems = async (scrollDirection) => {
    if (isLoading) return;
    isLoading = true;

    if (scrollDirection === 'up') {
      startItemIndex -= itemsPerPage;
      endItemIndex = startItemIndex - itemsPerPage;
      if (scrollContainer.children.length > MAX_ITEM_DISPLAY) {
        const excessItemCount =
          MAX_ITEM_DISPLAY - scrollContainer.children.length;
        for (let i = 0; i < excessItemCount; i++) {
          scrollContainer.removeChild(scrollContainer.lastChild);
        }
      }
    } else if (scrollDirection === 'down') {
      startItemIndex += itemsPerPage;
      endItemIndex = startItemIndex + itemsPerPage;
      if (scrollContainer.children.length > MAX_ITEM_DISPLAY) {
        const excessItemCount =
          scrollContainer.children.length - MAX_ITEM_DISPLAY;
        for (let i = 0; i < excessItemCount; i++) {
          scrollContainer.removeChild(scrollContainer.firstChild);
        }
      }
    }

    await loadingItems(startItemIndex, endItemIndex);

    isLoading = false;
  };

  const handleScroll = async () => {
    const topOfScroll = window.scrollY <= 100;
    const endOfScroll =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
    if (!isLoading) {
      if (endOfScroll) {
        await loadingMoreItems('down');
      } else if (topOfScroll) {
        await loadingMoreItems('up');
      }
    }
  };

  window.addEventListener('scroll', handleScroll);

  loadingItems();
}

document.addEventListener('DOMContentLoaded', loading);
