const MAX_VISIBLE_ITEMS = 100;

function initializeInfiniteScroll() {
  const ITEMS_PER_PAGE = 20;
  let firstVisibleIndex = 0;
  let lastVisibleIndex = firstVisibleIndex + ITEMS_PER_PAGE;
  let isFetching = false;
  let totalItemCount = null;
  const container = document.querySelector('.scroll-container');

  const renderItems = (items, prepend = false) => {
    if (prepend) {
      for (let i = items.length - 1; i >= 0; i--) {
        const itemDiv = document.createElement('div');
        itemDiv.textContent = items[i];
        itemDiv.classList.add('item');
        container.insertBefore(itemDiv, container.firstChild);
      }
    } else {
      items.forEach((item) => {
        const itemDiv = document.createElement('div');
        itemDiv.textContent = item;
        itemDiv.classList.add('item');
        container.appendChild(itemDiv);
      });
    }
  };

  const removeOverflowItems = (isDown) => {
    while (container.children.length > MAX_VISIBLE_ITEMS) {
      if (isDown) {
        container.removeChild(container.firstChild);
      } else {
        container.removeChild(container.lastChild);
      }
    }
  };

  const fetchTotalItemCount = async () => {
    const res = await fetch('/items/total');
    const data = await res.json();
    return data.total;
  };

  const fetchAndRenderItems = async (start, end, prepend = false) => {
    const response = await fetch(`/items?start=${start}&end=${end}`);
    const items = await response.json();
    renderItems(items, prepend);
  };

  const fetchMoreItems = async (direction) => {
    if (isFetching) return;
    isFetching = true;

    if (direction === 'up') {
      const newFirstIndex = Math.max(firstVisibleIndex - ITEMS_PER_PAGE, 0);
      const newLastIndex = firstVisibleIndex;
      if (newFirstIndex < firstVisibleIndex) {
        await fetchAndRenderItems(newFirstIndex, newLastIndex, true);
        firstVisibleIndex = newFirstIndex;
        lastVisibleIndex = Math.min(
          firstVisibleIndex + MAX_VISIBLE_ITEMS,
          totalItemCount
        );
        removeOverflowItems(false);
      }
    } else if (direction === 'down') {
      const newLastIndex = Math.min(
        lastVisibleIndex + ITEMS_PER_PAGE,
        totalItemCount
      );
      const newFirstIndex = lastVisibleIndex;
      if (newLastIndex > lastVisibleIndex) {
        await fetchAndRenderItems(newFirstIndex, newLastIndex, false);
        lastVisibleIndex = newLastIndex;
        firstVisibleIndex = Math.max(lastVisibleIndex - MAX_VISIBLE_ITEMS, 0);
        removeOverflowItems(true);
      }
    }

    isFetching = false;
  };

  const onScroll = async () => {
    const isAtTop = window.scrollY <= 100;
    const isAtBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
    if (!isFetching && totalItemCount !== null) {
      if (isAtBottom && lastVisibleIndex < totalItemCount) {
        await fetchMoreItems('down');
      } else if (isAtTop && firstVisibleIndex > 0) {
        window.scrollTo(0, 120);
        await fetchMoreItems('up');
      }
    }
  };

  window.addEventListener('scroll', onScroll);

  fetchTotalItemCount().then((total) => {
    totalItemCount = total;
    fetchAndRenderItems(
      firstVisibleIndex,
      Math.min(lastVisibleIndex, totalItemCount)
    );
  });
}

document.addEventListener('DOMContentLoaded', initializeInfiniteScroll);
