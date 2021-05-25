<!--
 * @Author: zeng_cheng
 * @Date: 2021-04-26 13:49:29
 * @LastEditTime: 2021-05-07 10:19:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cloud_app\src\components\app\optMenu.vue
-->

<template>
	<u-popup v-model="show" v-if="item" mode="bottom" border-radius="8" closeOnClickOverlay class="popup">
		<div class="head" @click.stop="toggleModal">
			<div class="block" />
		</div>
		<div class="fileInfo">
			<view class="img">
				<imgIcon :extName="getExtName(item.fileName || item.folderName)" :type="item.docId? 'file': 'folder'" />
			</view>
			<p class="fileName">
				<span>{{ item | formatListName }}</span>
				<span v-if="item.docId">{{
            getExtName(item.fileName)
              ? `.${getExtName(item.fileName)}`
              : ""
          }}</span>
			</p>
		</div>
		<div class="line" />
		<ul class="navMenu">
			<li>
				<span class="imgContainer">
					<img class="bigImg" src="/static/img/menu/share.png" />
				</span>
				<span class="des">分享</span>
			</li>
			<li @click="toMove" v-if="item.docId">
				<span class="imgContainer">
					<img class="bigImg" src="/static/img/menu/move.png" />
				</span>
				<span class="des">复制到</span>
			</li>
			<li @click="toMove">
				<span class="imgContainer">
					<img class="bigImg" src="/static/img/menu/move.png" />
				</span>
				<span class="des">移动到</span>
			</li>
			<li @click="toLabel">
				<span class="imgContainer">
					<img class="bigImg" src="/static/img/menu/tag.png" />
				</span>
				<span class="des">标签</span>
			</li>
		</ul>
		<ul class="otherOpt">
			<li v-if="item.docId" @click.stop="open">
				<img class="optImg" src="/static/img/menu/open.png" />
				<span>打开</span>
			</li>
			<li @click.stop="rename">
				<img class="optImg" src="/static/img/menu/rename.png" />
				<span>重命名</span>
			</li>
			<li @click.stop="removeItem">
				<img class="optImg" src="/static/img/menu/del.png" />
				<span>删除</span>
			</li>
		</ul>
	</u-popup>
</template>

<script>
	import Bus from "../utils/bus.js";
	import imgIcon from 'com/imgIcon';

	export default {
		data() {
			return {
				show: false,
			};
		},
		components:{
			imgIcon,
		},
		methods: {
			toggleModal() {
				this.show = !this.show;
			},
			removeItem() {
				this.toggleModal();
				Bus.$emit("listOption", "delete", this.item);
			},
			removeRecentItem() {
				this.toggleModal();
				Bus.$emit("listOption", "deleteRecently", this.item);
			},
			rename() {
				this.toggleModal();
				Bus.$emit("listOption", "rename", this.item);
			},
			open() {
				this.toggleModal();
				setTimeout(() => {
					Bus.$emit("listOption", "open", this.item);
				}, 300);
			},
			toMove() {
				this.toggleModal();
				setTimeout(() => {
					const {
						folderId,
						folderName,
						docId,
						fileName
					} = this.item;
					const {
						route,
						options
					} = this.$root.$mp.page;
					const moveInfo = !this.item.docId ?
						{
							folderId,
							folderName,
							route,
							options
						} :
						{
							docId,
							fileName,
							route,
							options
						};
					uni.setStorageSync("moveInfo", moveInfo);
					uni.navigateTo({
						url: '/pages/move/move'
					})
				}, 300);
			},
			toLabel() {
				this.toggleModal();
				const {
					docId,
					folderId,
				} = this.item;
				const url = docId? `/pages/label/label?docId=${docId}`: `/pages/label/label?folderId=${folderId}`
				uni.navigateTo({
					url,
				});
			},
		},
		props: {
			item: {
				required: true,
				type: Object | null,
				default: {},
			},
		},
	};
</script>

<style lang="scss" scoped>
	.height584 {
		height: 584rpx !important;
	}

	.popup {
		overflow: hidden;
		border-radius: 10rpx 10rpx 0 0;

		.head {
			height: 24rpx;
			display: flex;
			flex-direction: column-reverse;
			align-items: center;

			.block {
				width: 72rpx;
				height: 8rpx;
				background-color: #dee0e3;
				border-radius: 4rpx;
			}
		}

		.fileInfo {
			padding: 0 30rpx;
			height: 107rpx;
			display: flex;
			align-items: center;

			.img {
				width: 48rpx;
				height: 48rpx;
				margin-right: 24rpx;
			}

			.fileName {
				font-family: MicrosoftYaHei;
				font-size: 0;
				font-weight: normal;
				font-stretch: normal;
				letter-spacing: 1rpx;
				color: #333333;
				display: block;
				width: 489rpx;
				line-height: 48rpx;
				height: 48rpx;
				overflow: hidden;
				text-overflow: ellipsis;

				&>span:nth-child(1) {
					font-family: MicrosoftYaHei;
					font-size: 30rpx;
					font-weight: normal;
					font-stretch: normal;
					letter-spacing: 2rpx;
					color: #333333;
					display: inline-block;
					max-width: 370rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				&>span:nth-child(2) {
					font-family: MicrosoftYaHei;
					font-size: 30rpx;
					font-weight: normal;
					font-stretch: normal;
					letter-spacing: 2rpx;
					color: #333333;
					width: 100rpx;
					display: inline-block;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}

		.line {
			width: 100%;
			height: 14rpx;
			background-color: #f7f7f7;
		}

		.navMenu {
			height: 208rpx;
			border-bottom: 1px solid #eeeeee;
			display: grid;
			grid-template-columns: 1fr 1fr 1fr 1fr;
			align-items: center;

			li {
				display: flex;
				flex-direction: column;
				align-items: center;

				.imgContainer {
					width: 96rpx;
					height: 96rpx;
					background-color: #f7f7f7;
					border-radius: 48rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					margin-bottom: 20rpx;

					img {
						width: 35rpx;
						display: block;
					}
				}

				.des {
					font-family: MicrosoftYaHei;
					font-size: 24rpx;
					font-weight: normal;
					font-stretch: normal;
					letter-spacing: 1rpx;
					color: #666666;
				}
			}
		}

		.navMenu {
			height: 208rpx;
			border-bottom: 1px solid #eeeeee;
			display: grid;
			grid-template-columns: 1fr 1fr 1fr 1fr;
			align-items: center;

			li {
				display: flex;
				flex-direction: column;
				align-items: center;

				.imgContainer {
					width: 96rpx;
					height: 96rpx;
					background-color: #f7f7f7;
					border-radius: 48rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					margin-bottom: 20rpx;

					.bigImg {
						height: 35rpx;
						display: block;
					}
				}

				.des {
					font-family: MicrosoftYaHei;
					font-size: 24rpx;
					font-weight: normal;
					font-stretch: normal;
					letter-spacing: 1px;
					color: #666666;
				}
			}
		}

		.otherOpt {
			width: 100%;
			overflow: hidden;

			li:not(:last-child) {
				border-bottom: 1px solid #eeeeee;
			}

			li {
				width: 700rpx;
				margin-left: 50rpx;
				height: 110rpx;
				display: flex;
				align-items: center;

				.optImg {
					width: 33rpx;
					height: 33rpx;
					margin-right: 30rpx;
				}

				span {
					font-family: MicrosoftYaHei;
					font-size: 28rpx;
					font-weight: normal;
					font-stretch: normal;
					letter-spacing: 1rpx;
					color: #333333;
				}
			}
		}
	}
</style>
