/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */
#import "TiBase.h"

#ifdef USE_TI_MAP

#import <MapKit/MapKit.h>
#import "TiMapView.h"

@interface TiMapPinAnnotationView : MKPinAnnotationView<TiMapAnnotation> {
@private
	
	NSString * lastHitName;
}

-(id)initWithAnnotation:(id<MKAnnotation>)annotation reuseIdentifier:(NSString *)reuseIdentifier map:(TiMapView*)map;
-(NSString *)lastHitName;

@end

#endif