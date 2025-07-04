---
{
    "title": "ST_AREA",
    "language": "en"
}
---

## ST_Area_Square_Meters,ST_Area_Square_Km

### Syntax

```sql
DOUBLE ST_Area_Square_Meters(GEOMETRY geo)
DOUBLE ST_Area_Square_Km(GEOMETRY geo)
```

### description

Calculate the area of the area on the earth's sphere. Currently, the parameter geo supports St_Point, St_LineString, St_Circle and St_Polygon. 

Returns zero if the input is St_Point, St_LineString.

Among them, the unit returned by ST_Area_Square_Meters (GEOMETRY geo) is square meters, and the unit returned by ST_Area_Square_Km (GEOMETRY geo) is square kilometers.

### example

```
mysql> SELECT ST_Area_Square_Meters(ST_Circle(0, 0, 1));
+-------------------------------------------------+
| st_area_square_meters(st_circle(0.0, 0.0, 1.0)) |
+-------------------------------------------------+
|                              3.1415926535897869 |
+-------------------------------------------------+
1 row in set (0.04 sec)

mysql> SELECT ST_Area_Square_Km(ST_Polygon("POLYGON ((0 0, 1 0, 1 1, 0 1, 0 0))"));
+----------------------------------------------------------------------+
| st_area_square_km(st_polygon('POLYGON ((0 0, 1 0, 1 1, 0 1, 0 0))')) |
+----------------------------------------------------------------------+
|                                                   12364.036567076409 |
+----------------------------------------------------------------------+
1 row in set (0.01 sec)

mysql> SELECT ST_Area_Square_Meters(ST_Point(0, 1));
+-------------------------------------------+
| st_area_square_meters(st_point(0.0, 1.0)) |
+-------------------------------------------+
|                                         0 |
+-------------------------------------------+
1 row in set (0.05 sec)

mysql> SELECT ST_Area_Square_Meters(ST_LineFromText("LINESTRING (1 1, 2 2)"));
+-----------------------------------------------------------------+
| st_area_square_meters(st_linefromtext('LINESTRING (1 1, 2 2)')) |
+-----------------------------------------------------------------+
|                                                               0 |
+-----------------------------------------------------------------+
1 row in set (0.03 sec)
```
### keywords
ST_Area_Square_Meters,ST_Area_Square_Km,ST_Area,ST,Area
