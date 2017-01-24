# YAMV
Yet Another Map Viewer.

## What is it ?
A map, using [Google Maps JS API](https://developers.google.com/maps/documentation/javascript/tutorial) to visualise data from our geo-aggregator.

## How do I use it?

3 simple steps : 



- Replace ```API_KEY``` by a Google Maps API key either by generating one [here](https://developers.google.com/maps/documentation/javascript/) in the following code in yamv.html.

```html
    <script src="https://maps.googleapis.com/maps/api/js?key=API_KEY&callback=initMap&libraries=visualization"
    async defer></script>
```

- You need [YAGA](https://github.com/BigStructureTeam/YAGA) to generate and receive data.


- See [Wiki](https://github.com/BigStructureTeam/YAMV/wiki) for more information about YAMV UX/UI.
