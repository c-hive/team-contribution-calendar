import $ from "elly";
import * as colorSchemas from "../../resources/ColorSchemas/ColorSchemas";
import LoaderIcon from "../../resources/LoaderIcon/LoaderIcon.svg";
import elementIds from "../../resources/ElementIds/ElementIds";

export const container = containerSelector => {
  const element = $(containerSelector);

  element.style.display = "inline-block";
  element.style.width = "700px";
  element.style.borderTopLeftRadius = "3px";
  element.style.borderTopRightRadius = "3px";
  element.style.border = "1px solid #E1E4E8";
  element.style.padding = "10px 20px";
  element.style.minWidth = "350px";
  element.style.fontSize = "14px";

  return element;
};

export const svgContainer = () => {
  const svgContainerElement = document.createElement("DIV");

  svgContainerElement.id = elementIds.SVG_CONTAINER;

  return svgContainerElement;
};

const getColorElement = color => {
  const colorELement = document.createElement("LI");

  colorELement.style.width = "10px";
  colorELement.style.height = "10px";
  colorELement.style.display = "inline-block";
  colorELement.style.margin = "0 2px";
  colorELement.style.backgroundColor = color;

  return colorELement;
};

const getColorsList = () => {
  const calendarColorsList = document.createElement("UL");

  calendarColorsList.style.listStyle = "none";

  colorSchemas.gitHub.forEach(color => {
    const colorElement = getColorElement(color);

    calendarColorsList.appendChild(colorElement);
  });

  const lessText = document.createElement("SPAN");
  lessText.innerText = "Less";
  lessText.style.margin = "0 5px";
  lessText.style.color = "#767676";

  const moreText = document.createElement("SPAN");
  moreText.innerText = "More";
  moreText.style.margin = "0 5px";
  moreText.style.color = "#767676";

  calendarColorsList.insertBefore(lessText, calendarColorsList.childNodes[0]);
  calendarColorsList.insertBefore(moreText, calendarColorsList.nextSibling);

  return calendarColorsList;
};

export const header = (totalContributions, isLoading) => {
  const calendarHeader = document.createElement("DIV");
  const calendarColorsList = getColorsList();

  calendarHeader.id = elementIds.HEADER;
  calendarHeader.style.fontSize = "1em";

  const contributionsValueDisplayer = document.createElement("P");
  contributionsValueDisplayer.innerHTML = LoaderIcon;

  if (isLoading) {
    contributionsValueDisplayer.style.height = "15px";
  }

  if (!isLoading) {
    contributionsValueDisplayer.innerText = `${totalContributions} contributions in the last year`;
  }

  calendarHeader.appendChild(contributionsValueDisplayer);
  calendarHeader.appendChild(calendarColorsList);

  calendarHeader.style.display = "flex";
  calendarHeader.style.justifyContent = "space-between";
  calendarHeader.style.alignItems = "center";

  return calendarHeader;
};

export const tooltip = () => {
  const calendarTooltip = document.createElement("DIV");

  calendarTooltip.id = elementIds.TOOLTIP;

  calendarTooltip.style.background = "rgba(0, 0, 0, 0.8)";
  calendarTooltip.style.borderRadius = "3px";
  calendarTooltip.style.fontSize = "12px";
  calendarTooltip.style.padding = "10px";
  calendarTooltip.style.textAlign = "center";
  calendarTooltip.style.position = "absolute";
  calendarTooltip.style.display = "none";
  calendarTooltip.style.left = "0px";
  calendarTooltip.style.top = "0px";

  return calendarTooltip;
};

const getDateText = date => {
  const dateText = document.createElement("SPAN");

  dateText.style.color = "#959DA5";
  dateText.style.fontWeight = "normal";
  dateText.innerText = ` on ${date}`;

  return dateText;
};

export const contributionsWithDateText = (contributions, date) => {
  const tooltipInnerText = document.createElement("SPAN");

  tooltipInnerText.style.color = "#FFFFFF";
  tooltipInnerText.style.fontWeight = "bold";
  tooltipInnerText.innerText = "No contributions";

  if (contributions > 0) {
    tooltipInnerText.innerText = `${contributions} contributions`;
  }

  const dateText = getDateText(date);

  tooltipInnerText.appendChild(dateText);

  return tooltipInnerText;
};
