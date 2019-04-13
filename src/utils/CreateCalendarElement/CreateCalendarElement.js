import $ from 'elly';
import * as ColorSchemas from '../../resources/ColorSchemas/ColorSchemas';

export const container = (htmlContainerElement) => {
  const selectedDOMElement = $(htmlContainerElement);

  selectedDOMElement.style.width = '700px';
  selectedDOMElement.style.borderTopLeftRadius = '3px';
  selectedDOMElement.style.borderTopRightRadius = '3px';
  selectedDOMElement.style.border = '1px solid #E1E4E8';
  selectedDOMElement.style.padding = '10px 0 10px 20px';
  selectedDOMElement.style.margin = '20px auto';
  selectedDOMElement.style.fontSize = '10px';

  return selectedDOMElement;
};

export const header = () => {
  const calendarHeader = document.createElement('DIV');

  calendarHeader.style.display = 'flex';
  calendarHeader.style.justifyContent = 'space-between';
  calendarHeader.style.alignItems = 'center';
  calendarHeader.style.width = '670px';

  return calendarHeader;
};

const createColorElement = (color) => {
  const colorELement = document.createElement('LI');

  colorELement.style.width = '10px';
  colorELement.style.height = '10px';
  colorELement.style.display = 'inline-block';
  colorELement.style.margin = '0 2px';
  colorELement.style.backgroundColor = color;

  return colorELement;
};

export const colorsList = () => {
  const calendarColorsList = document.createElement('UL');

  calendarColorsList.style.listStyle = 'none';
  calendarColorsList.style.fontSize = '12px';

  ColorSchemas.GitHub.forEach((color) => {
    const colorElement = createColorElement(color);

    calendarColorsList.appendChild(colorElement);
  });

  const lessText = document.createElement('SPAN');
  lessText.innerText = 'Less';
  lessText.style.margin = '0 5px';

  const moreText = document.createElement('SPAN');
  moreText.innerText = 'More';
  moreText.style.margin = '0 5px';

  calendarColorsList.insertBefore(lessText, calendarColorsList.childNodes[0]);
  calendarColorsList.insertBefore(moreText, calendarColorsList.nextSibling);

  return calendarColorsList;
};
