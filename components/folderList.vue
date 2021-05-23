<template>
	<div class="mainList">
		<div class="listContainer">
			<scroll-view class="pullRefresh" :refresher-triggered="triggered" @refresherrefresh="onRefresh"
				refresher-enabled @scrolltolower="load" lower-threshold="300" scroll-y="true">
				<ul v-if="totalList && totalList.length !== 0">
					<li class="listItem" v-for="item in totalList" :key="item.id"
						:listType="item.docId ? 'file' : 'folder'" :docId="item.docId" :folderId="item.folderId"
						@click.stop="handleClickItem(item)">
						<img v-if="!item.docId" class="img" src="/static/img/list/folder.png" alt="folder" />
						<img v-else-if="getExtName(item.fileName || item.folderName) === 'pdf'" class="img"
							src="/static/img/list/pdf.png" alt="pdf" />
						<img v-else-if="
                getExtName(item.fileName || item.folderName) === 'doc' ||
                getExtName(item.fileName || item.folderName) === 'docx'
              " class="img" src="/static/img/list/word.png" alt="word" />
						<img v-else-if="
                getExtName(item.fileName || item.folderName) === 'wmv' ||
                getExtName(item.fileName || item.folderName) === 'mp4' ||
                getExtName(item.fileName || item.folderName) === 'avi'
              " class="img" src="/static/img/list/video.png" alt="video" />
						<img v-else-if="
                getExtName(item.fileName || item.folderName) === 'xls' ||
                getExtName(item.fileName || item.folderName) === 'xlsx'
              " class="img" src="/static/img/list/excel.png" alt="excel" />
						<img v-else-if="
                getExtName(item.fileName || item.folderName) === 'ppt' ||
                getExtName(item.fileName || item.folderName) === 'pptx'
              " class="img" src="/static/img/list/ppt.png" alt="ppt" />
						<img v-else-if="
                getExtName(item.fileName || item.folderName) === 'jpg' ||
                getExtName(item.fileName || item.folderName) === 'png' ||
                getExtName(item.fileName || item.folderName) === 'jpeg'
              " class="img" src="/static/img/list/jpg.png" alt="jpg" />
						<img v-else-if="
                getExtName(item.fileName || item.folderName) === 'zip' ||
                getExtName(item.fileName || item.folderName) === 'rar' ||
                getExtName(item.fileName || item.folderName) === 'iso'
              " class="img" src="/static/img/list/zip.png" alt="zip" />
						<img v-else class="img" src="/static/img/list/other.png" />
						<div class="info">
							<div>
								<p class="title">
									<span>{{ item | formatListName }}</span>
									<span v-if="item.docId">{{
                    getExtName(item.fileName)
                      ? `.${getExtName(item.fileName)}`
                      : ""
                  }}</span>
								</p>
								<p class="date">
									<span class="data_child">{{ item.createTime.substring(0, 16) }}</span>
									<span v-if="item.size">{{ item.size | bytesToSize }}</span>
									<span v-else>{{ item.size }}</span>
									<span class="tags" v-if="item.labelList">
										<ul>
											<li :key="label.id" v-for="(label, index) in item.labelList">
												<span :class="`tag-`+ index" v-if="index < 4" :style="{
                            backgroundColor: label.labelColor,
                          }" />
											</li>
										</ul>
									</span>
								</p>
							</div>
							<div class="opt" v-if="item.acl !== 'r' && !hideMenu" @click.stop="showPopup(item)" >
								<img src="/static/img/menu/opt.png" class="optIcon" />
							</div>
						</div>
					</li>
				</ul>
				<ul v-if="isShowSkeleton && !listClosure">
					<li class="listItem" :key="index" v-for="(item, index) in 20">
						<div>
							<span class="img_ske" />
						</div>
						<div class="info_ske">
							<div class="title_ske" />
							<div class="date_ske" />
						</div>
					</li>
				</ul>
				<div class="empty" v-else-if="totalList.length === 0">
					<img class="empty_img" src="/static/img/list/empty.png" />
					<p>暂无数据</p>
				</div>
			</scroll-view>
		</div>
	</div>
</template>

<script>
	import OptMenu from "./optMenu.vue";

	export default {
		components: {
			OptMenu,
		},
		data() {
			return {
				triggered: false,
				_freshing: false,
			};
		},
		methods: {
			// 下拉刷新
			onRefresh() {
				console.log('出发下拉刷新-进入')
				if (this._freshing) return;
				this._freshing = true;
				if (!this.triggered) this.triggered = true; //界面下拉触发，triggered可能不是true，要设为true
				console.log('出发下拉刷新-发起')
				const callback = () => {
					this.triggered = false;
					this._freshing = false;
				};
				this.$emit("initList", callback);
			},
			// 点击列表Item
			handleClickItem(item) {
				this.$emit("handleTdClick", item);
			},
			load() {
				this.$emit("loadMore");
			},
				
			showPopup(item) {
				this.$emit("showPopup", item)
			},
		},
		props: {
			totalList: {
				type: Array,
				required: true,
				default: () => [],
			},
			labelListData: {
				type: Array,
				required: true,
				default: () => [],
			},
			listClosure: {
				type: Boolean,
				required: true,
				default: () => false,
			},
			rollLoad: {
				type: Boolean,
				required: true,
				default: () => false,
			},
			isShowSkeleton: {
				type: Boolean,
				required: true,
				default: () => true,
			},
			hideMenu: {
				type: Boolean,
				default: () => false,
			},
		},
	};
</script>

<style lang="scss" scoped>
	.mainList {
		height: 100%;
		position: relative;
	}

	.listContainer {
		height: 100%;
		position: relative;
		overflow-y: hidden;

		::-webkit-scrollbar{
		width: 0;
		height: 0;
		color: transparent;
		}

		.pullRefresh {
			overflow-y: auto;
			height: 100% !important;
			position: relative;
			overflow-x: hidden !important;

			.listItem {
				width: 100%;
				min-height: 135rpx;
				display: grid;
				grid-template-columns: 132rpx 618rpx;

				.img {
					width: 48rpx;
					height: 48rpx;
					margin-left: 42rpx;
					margin-top: 42rpx;
				}

				.info {
					display: flex;
					padding: 25rpx 0 25rpx 0;
					justify-content: space-between;
					border-bottom: 1px solid #eeeeee;

					.title {
						font-family: MicrosoftYaHei;
						font-size: 0;
						font-weight: normal;
						font-stretch: normal;
						letter-spacing: 1rpx;
						color: #333333;
						margin-bottom: 15rpx;
						display: block;
						width: 489rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						height: 36rpx;
						line-height: 36rpx;

						&>span:nth-child(1) {
							font-size: 28rpx;
							display: inline-block;
							max-width: 370rpx;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}

						&>span:nth-child(2) {
							font-size: 28rpx;
							width: 100rpx;
							display: inline-block;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
					}

					.date {
						font-family: MicrosoftYaHei;
						font-size: 24rpx;
						font-weight: normal;
						font-stretch: normal;
						letter-spacing: 1rpx;
						color: #999999;
						.data_child{
							margin-right: 10rpx;
						}
						.tags {
							position: absolute;

							ul {
								display: flex;
								margin-left: 10rpx;

								li {
									position: relative;
									display: block;

									span {
										display: block;
										position: relative;
										width: 24rpx;
										height: 24rpx;
										border: solid 1px #ffffff;
										border-radius: 12rpx;
									}
								}
							}
						}
					}
				}
			}

			.listItem {
				.img_ske {
					display: block;
					background-color: rgb(246, 247, 249);
					border-radius: 36rpx;
					width: 72rpx;
					height: 72rpx;
					margin-left: 30rpx;
					margin-top: 30rpx;
				}

				.info_ske {
					display: flex;
					padding: 30rpx 40rpx 30rpx 0;
					border-bottom: 1px solid #eeeeee;
					flex-direction: column;

					.title_ske {
						background-color: rgb(246, 247, 249);
						width: 250rpx;
						height: 28rpx;
						margin-bottom: 15rpx;
					}

					.date_ske {
						background-color: rgb(246, 247, 249);
						width: 380rpx;
						height: 28rpx;
					}
				}
			}
		}

		.opt {
			height: 72rpx;
			display: flex;
			width: 100rpx;
			flex-direction: row-reverse;
			align-items: center;
			padding-right: 40rpx;
			.optIcon {
			  width: 34rpx;
			  height: 7rpx;
			}
		}
	}

	.empty {
		font-family: MicrosoftYaHei;
		font-size: 30rpx;
		font-weight: normal;
		font-stretch: normal;
		line-height: 29rpx;
		letter-spacing: 0rpx;
		color: #666666;
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 100%;
		align-items: center;

		.empty_img {
			display: block;
			height: 219rpx;
			width: 438rpx;
			margin-bottom: 20rpx;
		}
	}

	@for $i from 0 to 1000 {
		.tag-#{$i} {
			left: -$i * 30%;
		}
	}

	.van-pull-refresh {
		overflow: auto !important;
	}

	.van-pull-refresh__track {
		height: auto !important;
	}

	.van-list {
		height: auto !important;
	}
</style>
