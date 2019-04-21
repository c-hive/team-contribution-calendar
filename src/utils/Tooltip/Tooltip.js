import * as GetStyledCalendarElement from '../GetStyledCalendarElement/GetStyledCalendarElement';

const showTooltip = (event) => {
  const hoveredDay = event.target;

  const contributions = Number(hoveredDay.getAttribute('data-count'));
  const date = hoveredDay.getAttribute('data-date');

  const tooltipElement = document.getElementById('tooltip');

  const tooltipInnerText = GetStyledCalendarElement.contributionsWithDateText(
    contributions, date,
  );

  tooltipElement.appendChild(tooltipInnerText);

  const hoveredDayPositionAttributes = hoveredDay.getBoundingClientRect();

  tooltipElement.style.display = 'block';
  tooltipElement.style.top = `${hoveredDayPositionAttributes.top - 35}px`;
  tooltipElement.style.left = `${hoveredDayPositionAttributes.left - (tooltipElement.clientWidth / 2)}px`;
};

const hideTooltip = () => {
  const tooltipElement = document.getElementById('tooltip');

  if (tooltipElement.childNodes.length === 0) {
    return;
  }

  tooltipElement.style.display = 'none';
  tooltipElement.style.top = '0px';
  tooltipElement.style.left = '0px;';

  tooltipElement.removeChild(tooltipElement.childNodes[0]);
};

export const addEventsToRectElements = () => {
  const rectElements = document.getElementsByTagName('rect');
  const rectsArray = Array.from(rectElements);

  rectsArray.forEach((rect) => {
    rect.addEventListener('mouseenter', showTooltip);
    rect.addEventListener('mouseleave', hideTooltip);
  });
};
