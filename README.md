### Darghos Item Manager

This is a item manager developed (unfinished yet) for my game project (Darghos). It has been writen initially to support me to analysis and merge two different sprites files.

The main idea here is that this project will parse `.dat` into a SQLite file. From this point, I can build complex queries to analysis better the changes in its both items structure, move items from one "file" to another, etc and all other powerfull stuff you can do dealing with SQL queries.

In the end you will be able to just build back the modified `.dat` and `.spr` in SQLite to to binary file.

### Used tecnhologies

It's build by using NodeJS and Electron. To deal with boring stuffs of frontend part it uses Mithril.js, which makes boring front-end stuffs be less boring.

### Build / Run

At this point you already suppoused to have NodeJS installed and working well (I use 19.xx.)

```
# Building
npm install
npm run build

# You must manually copy static files to the build output directory, which should be ./app
copy -R ./static ./app

npm run start
```

If you lucky. It should gracefully start.

### Roadmap

> [!IMPORTANT]
> This project is in very early development stage, it yet unable to be used as a dat/spr editor, if you looking for this, I recommend already fully working programs like `ObjectBuilder`.

- [x] Parse .dat binary file into SQLite
- [x] Parse .spr binary to be used to render images on Electron
- [x] Create a simple page that shows differences on two .dat files based in their attributes (that's my main goal)
- [ ] Parse items from SQLite back to .dat in binary format
- [ ] Move items from one .dat to another .dat (and ofc, move the sprites as well)
- [ ] Parse changed sprites back to .spr in binary format

# Bonus

Things I would like to do if all above is done

- [ ] Read also items.otb and items.xml (server side) integrated with their .dat and .spr, and making all changes to dat also affects .otb (in other words, you would do one change, and it reflects in all items files if needed at once).
- [ ] Unit tests
