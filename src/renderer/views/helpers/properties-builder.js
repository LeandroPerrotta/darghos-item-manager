/**
 * 
 * @param {PropertiesBuildType} properties 
 */
export function propertiesBuilder(properties) {

    const panelProperties = { ...properties };

    if (properties.class && properties.class.length) {

        panelProperties.class = panelProperties.class.join(' ');
    }

    return panelProperties;
}